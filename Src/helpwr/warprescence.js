const {fetchJson,smd, tlang,send, shazam, getBuffer, prefix, Config ,groupdb } = require("../lib")
smd(
  {
    pattern: "state", // Change the command name to 'fref'
    desc: "Manage presence status based on user input.",
    category: "utility",
    filename: __filename,
  },
  async (message) => {
    try {
      // Default presence based on environment variable
      global.waPresence =
        process.env.WAPRESENCE && process.env.WAPRESENCE === "online"
          ? "available"
          : process.env.WAPRESENCE || "";

      // Normalize the command and split it
      const command = message.text.trim().toLowerCase(); // Normalize the command
      const prefix = global.prefix || '.'; // Use a default prefix if global.prefix is not set

      // Check if the message starts with the defined prefix
      if (command.startsWith(prefix)) {
        // Extract the command and the presence status
        const args = command.substring(prefix.length).split(" "); // Remove the prefix and split by space
        const presenceCommand = args[0]; // First part after prefix

        // Check if the command is for presence update
        if (presenceCommand === "fref" && args.length > 1) {
          const desiredPresence = args[1]; // Second part is the desired presence status

          // Set the waPresence based on the provided status
          if (["typing", "composing"].includes(desiredPresence)) {
            global.waPresence = "composing"; // Set to composing if "typing" or "composing" is given
          } else if (["available"].includes(desiredPresence)) {
            global.waPresence = "available"; // Set to available
          } else if (["unavailable"].includes(desiredPresence)) {
            global.waPresence = "unavailable"; // Set to unavailable
          } else if (["recording"].includes(desiredPresence)) {
            global.waPresence = "recording"; // Set to recording
          } else if (["paused"].includes(desiredPresence)) {
            global.waPresence = "paused"; // Set to paused
          } else {
            return await message.send("Invalid presence status. Use typing, available, unavailable, recording, or paused.");
          }
          
          // Send presence update
          message.bot.sendPresenceUpdate(global.waPresence, message.from);
          return await message.send(`Presence updated to: ${global.waPresence}`);
        }
      }

      // Optional: React to the message
      if (message.isAstro && !message.fromMe && !message.text.startsWith("$")) {
        message.react(""); // Add your reaction here
      }
    } catch (e) {
      console.log(e);
    }
  }
);