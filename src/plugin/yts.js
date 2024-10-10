import yts from 'yt-search';
import ytdl from 'ytdl-core';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Use a global variable to store the topVideos and video index
const videoMap = new Map();
let videoIndex = 1; // Global index for video links
let audioIndex = 1001; // Separate index for audio links to ensure unique IDs

const song = async (m, Matrix) => {
  let selectedListId;
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;

  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      selectedListId = params.id;
    }
  }

  const selectedId = selectedListId || selectedButtonId;

  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  
  const validCommands = ['yts', 'ytsearch'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Please provide a YouTube URL or search query');

    try {
      await m.React("📡");

      // Search YouTube for the provided query
      const searchResult = await yts(text);
      const topVideos = searchResult.videos.slice(0, 10);

      if (topVideos.length === 0) {
        m.reply('No results found.');
        await m.React("🙆‍♂️");
        return;
      }

      const videoButtons = topVideos.map((video, index) => {
        const uniqueId = videoIndex + index;
        videoMap.set(uniqueId, { ...video, isAudio: false });
        return {
          "header": "",
          "title": video.title,
          "description": ``,
          "id": `video_${uniqueId}` // Unique key format for video buttons
        };
      });

      const audioButtons = topVideos.map((video, index) => {
        const uniqueId = audioIndex + index;
        videoMap.set(uniqueId, { ...video, isAudio: true });
        return {
          "header": "",
          "title": video.title,
          "description": ``,
          "id": `audio_${uniqueId}` // Unique key format for audio buttons
        };
      });

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `Trex Md Video Downloader\n\n🔍 Download audio or video with a single click.\n\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "© Powered By Trex Md"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia({ image: { url: `https://imgtr.ee/images/2024/09/14/a36fb8cf045cdde562f56c49470c037e.jpeg` } }, { upload: Matrix.waUploadToServer })),
                title: ``,
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "🔖 Select a video",
                      sections: [
                        {
                          title: "😎 Top 10 YouTube Results - Videos",
                          highlight_label: "🤩 Top 10",
                          rows: videoButtons
                        },
                      ]
                    })
                  },
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "🎧 Select an audio",
                      sections: [
                        {
                          title: "🎶 Top 10 YouTube Results - Audios",
                          highlight_label: "🤩 Top 10",
                          rows: audioButtons
                        },
                      ]
                    })
                  },
                ],
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: false,
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      await m.React("🚀");

      // Increment the global video and audio indices for the next set of videos
      videoIndex += topVideos.length;
      audioIndex += topVideos.length;
    } catch (error) {
      console.error("Error processing your request:", error);
      m.reply('Error processing your request.');
      await m.React("🙆‍♂️");
    }
  } else if (selectedId) { // Check if selectedId exists
    const isAudio = selectedId.startsWith('audio_');
    const key = parseInt(selectedId.replace(isAudio ? 'audio_' : 'video_', ''));
    const selectedVideo = videoMap.get(key); // Find video by unique key

    if (selectedVideo) {
      try {
        const videoInfo = await ytdl.getBasicInfo(selectedVideo.videoId);
        const title = videoInfo.videoDetails.title;
        const author = videoInfo.videoDetails.author.name;
        const duration = videoInfo.videoDetails.lengthSeconds;
        const uploadDate = videoInfo.videoDetails.uploadDate;
        const videoUrl = `https://www.youtube.com/watch?v=${selectedVideo.videoId}`;
        const thumbnailUrl = selectedVideo.thumbnail; // Get the thumbnail URL from search results

        if (selectedVideo.isAudio) {
          // Download audio
          const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
          const finalAudioBuffer = await streamToBuffer(audioStream);
          
          await Matrix.sendMessage(m.from, { image: { url: thumbnailUrl }, caption: `Title: ${title}\nAuther: ${author}\nDuration: ${duration}\n *© Powered by Mercedes*`}, { quoted: m });

          await Matrix.sendMessage(m.from, { audio: finalAudioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
        } else {
          // Download video
          const videoStream = ytdl(videoUrl, { filter: 'audioandvideo', quality: 'highest' });
          const finalVideoBuffer = await streamToBuffer(videoStream);

          await Matrix.sendMessage(m.from, { video: finalVideoBuffer, mimetype: 'video/mp4', caption: `Title: ${title}\nAuther: ${author}\nDuration: ${duration}\n\n *Powered by Mercedes*` }, { quoted: m });
        }
      } catch (error) {
        console.error("Error fetching video brooh:", error);
        
      }
    } else {
      
    }
  }
};

const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

export default song;
                                
