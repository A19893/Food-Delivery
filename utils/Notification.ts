//Email

//Notifications

//OTP
export const GenerateOtp = () => {
     const otp = Math.floor(100000 + Math.random()+ 900000);
     let expiry = new Date();
     expiry.setTime( new Date().getTime() + (30*60*1000));
     return {otp, expiry}
}

export const onRequestOTP =async (otp: number, toPhoneNumber:string) => {
    
    const accountSid ='ACbb331427412748e63cde3e1dc4ea2000';
    const authToken ='3add8dfe8415e356920550373abe5d52';

    const client= require('twilio')(accountSid,authToken);

    const response = await client.messages.create({
        body: `Your Otp is ${otp}`,
        from: '+12296291230',
        to: `+91${toPhoneNumber}`,
    })

    return response; 
}