import JavaScriptObfuscator from 'javascript-obfuscator'


const encryptCode = async (client, m) => {
  let forq = m.quoted ? m.quoted.text ? m.quoted.text : m.text : m.text;
  
  if (!forq) return m.reply('Quote/tag a code to encrypt');

  const obfuscationResult = JavaScriptObfuscator.obfuscate(forq, {
    compact: false,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true,
    splitStrings: true,
    stringArrayThreshold: 1
  });

  console.log("Successfully encrypted the code");
  m.reply(obfuscationResult.getObfuscatedCode());

};

export default encryptCode;
