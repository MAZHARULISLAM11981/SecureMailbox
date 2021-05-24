import Email from '../../models/Email';
import User from '../../models/User';
import sendData from '../../utils/response/sendData';
import sendMessage from '../../utils/response/sendMessage';
import emailValidator from '../../utils/validators/Email';

class Emails {
  async get (email) {
    const emailInfo = await Email.find({ $or: [
      { from: email },
      { to: email }
    ] });

    for (let i = 0; i < emailInfo.length; i++) {
      if(emailInfo[i].from === email) {
        emailInfo[i]._doc.type = 'Send';
      } else {
        emailInfo[i]._doc.type = 'Received';
      }
    }
    
    return sendData('ok', emailInfo);
  }

  async create (body) {

    // body verification
    const validateMessage = emailValidator(body);
    if (validateMessage !== "ok") return sendMessage("fail", validateMessage);

    const { 
      subject,
      filePath,
      message,
      from,
      to, 
    } = body;

    const checkSender = await User.findOne({ email: from });
    if (!checkSender) return sendMessage("fail", 'Unauthorized user');

    const checkReceiver = await User.findOne({ email: to });
    if (!checkReceiver) return sendMessage("fail", 'User not found!!!');

    const createEmailInfo = await Email.create({
      subject,
      filePath,
      message,
      from,
      to,
      createAt: Date.now()
    });

    return sendData('ok', createEmailInfo);
  }
}

export default Emails;
