export const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const generateMailContent = (otp: string, userName: string) => {
    return `
        <div style="padding: 10px; font-family: 'Poppins', sans-serif;">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Baumans&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                body, div, h1, h3, p {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            <h1>Verifikasi Email</h1>
            <p>Hai, <span style="font-weight: bold;">${userName}</span></p>
            <p style="font-weight: 500;">Masukkan kode OTP berikut untuk verifikasi email Anda:</p>
            <div style="display: flex; justify-content: center; align-items: center; border: 1px solid #828282; max-width: 150px; max-height: 55px; border-radius: 10px; margin: 0 auto">
                <h3>${otp}</h3>
            </div>
            <p style="font-size: 12px; padding-top: 5px; padding-bottom: 10px;">Kode OTP di atas hanya berlaku selama 60 detik.</p>
            <p style="font-size: 10px;">Email ini dikirim secara otomatis oleh sistem, mohon tidak membalas.</p>
        </div>
    `;
}
