const handler = async (m, {conn, command, text}) => {
  if (!text) return conn.reply(m.chat, 'tag a person?', m);

  const personalidad = `https://whatsapp.com/channel/0029Vajvy2kEwEjwAKP4SI0x 
┏━━°❀❬ *PERSONALITY}* ❭❀°━━┓
*┃*
*┃• NAME* : ${text}
*┃• COSTUME* : ${pickRandom(['6%', '12%', '20%', '27%', '35%', '41%', '49%', '54%', '60%', '66%', '73%', '78%', '84%', '92%', '93%', '94%', '96%', '98,3%', '99,7%', '99,9%', '1%', '2,9%', '0%', '0,4%'])}
*┃• CHARACTER* : ${pickRandom(['6%', '12%', '20%', '27%', '35%', '41%', '49%', '54%', '60%', '66%', '73%', '78%', '84%', '92%', '93%', '94%', '96%', '98,3%', '99,7%', '99,9%', '1%', '2,9%', '0%', '0,4%'])}
*┃• TYPE OF PERSON* : ${pickRandom(['Good-hearted', 'Arrogant', 'Stingy', 'Generous', 'Humble', 'Shy', 'Cowardly', 'Invasive', 'Crystalline', 'No binary XD', 'Stupid'])}
*┃• HOBBIES* : ${pickRandom(['masturbation', 'Bad', 'Drinking alcohol', 'Annoying', 'To Gossip', 'to argue', 'to fuck', 'Watch anime', 'Chat on WhatsApp because he is single', 'fake or good for nothing'])}
*┃• INTELLIGENCE* : ${pickRandom(['6%', '12%', '20%', '27%', '35%', '41%', '49%', '54%', '60%', '66%', '73%', '78%', '84%', '92%', '93%', '94%', '96%', '98,3%', '99,7%', '99,9%', '1%', '2,9%', '0%', '0,4%'])}
*┃• CRIME* : ${pickRandom(['6%', '12%', '20%', '27%', '35%', '41%', '49%', '54%', '60%', '66%', '73%', '78%', '84%', '92%', '93%', '94%', '96%', '98,3%', '99,7%', '99,9%', '1%', '2,9%', '0%', '0,4%'])}
*┃• SOCIAL* : ${pickRandom(['6%', '12%', '20%', '27%', '35%', '41%', '49%', '54%', '60%', '66%', '73%', '78%', '84%', '92%', '93%', '94%', '96%', '98,3%', '99,7%', '99,9%', '1%', '2,9%', '0%', '0,4%'])}
*┃• HYGGINE* : ${pickRandom(['6%', '12%', '20%', '27%', '35%', '41%', '49%', '54%', '60%', '66%', '73%', '78%', '84%', '92%', '93%', '94%', '96%', '98,3%', '99,7%', '99,9%', '1%', '2,9%', '0%', '0,4%'])}
*┃• FAME* : ${pickRandom(['6%', '12%', '20%', '27%', '35%', '41%', '49%', '54%', '60%', '66%', '73%', '78%', '84%', '92%', '93%', '94%', '96%', '98,3%', '99,7%', '99,9%', '1%', '2,9%', '0%', '0,4%'])}
*┃• GENDER* : ${pickRandom(['male','female','hermaphrodite'])}
┗━━━━━━━━━━━━━━━━
`;
  conn.reply(m.chat, personalidad, m, {mentions: conn.parseMention(personalidad)});
};
handler.help = ['personality *<nombre>*'];
handler.tags = ['fun'];
handler.command = /^personality/i;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
  }
