import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmailClose = (receiverEmail, totalExpense, limit) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_ID, 
            pass: process.env.GOOGLE_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GOOGLE_ID, 
        to: receiverEmail, 
        subject: "Expense Limit Close to Exceeding",
        text: `We wanted to inform you that your expenses are close to reaching the limit. 
Details of your expenses:

- Total Expenses: ₹ ${totalExpense}
- Expense Limit: ₹ ${limit}
- Remaining Balance: ₹ ${limit - totalExpense}

We kindly advise you to review your spending habits and consider making adjustments to stay within your budget. It's crucial to maintain financial discipline to achieve your financial goals.
Thank you for your attention to this matter.

Best regards,
𝙵𝚒𝚗𝚝𝚛𝚊𝚌𝚔`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error.message);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendEmailExceed = (receiverEmail, totalExpense, limit) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_ID, 
            pass: process.env.GOOGLE_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GOOGLE_ID, 
        to: receiverEmail, 
        subject: "Expense Limit Exceeded Alert",
        text: `We regret to inform you that your expense limit has been exceeded. 
Details of your expenses:

- Total Expenses: ${totalExpense}
- Expense Limit: ${limit}

We kindly advise you to review your spending habits and consider making adjustments to stay within your budget. It's crucial to maintain financial discipline to achieve your financial goals.
Thank you for your attention to this matter.

Best regards,
𝙵𝚒𝚗𝚝𝚛𝚊𝚌𝚔`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error.message);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

export { sendEmailExceed, sendEmailClose };