"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewBakeryMailContent = exports.generateRejectBakeryMailContent = exports.generateDeactivateBakeryMailContent = exports.generateActivateBakeryMailContent = void 0;
const generateActivateBakeryMailContent = (userName, status, message) => {
    return `
        <div style="padding: 10px; font-family: 'Poppins', sans-serif;">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Baumans&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                body, div, h1, h3, p {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            <h1>Status Bakeri</h1>
            <p>Hai, <span style="font-weight: bold;">${userName || ''}</span></p>
            <p style="font-weight: 500;"><span style="font-weight: bold;">${status || ''}</span></p>
            <p style="margin-top: 15px; font-weight: 400; font-size: 14px; color: #333;">
                ${message || ''}
            </p>
            <p style="font-size: 10px;">Apabila Anda memiliki pertanyaan lebih lanjut, silakan hubungi kami.</p>
        </div>
    `;
};
exports.generateActivateBakeryMailContent = generateActivateBakeryMailContent;
const generateDeactivateBakeryMailContent = (userName, status, message) => {
    return `
        <div style="padding: 10px; font-family: 'Poppins', sans-serif;">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Baumans&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                body, div, h1, h3, p {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            <h1>Status Bakeri</h1>
            <p>Hai, <span style="font-weight: bold;">${userName || ''}</span></p>
            <p style="font-weight: 500;"><span style="font-weight: bold;">${status || ''}</span></p>
            <p style="margin-top: 5px; font-weight: 400; font-size: 14px; color: #333;">
                ${`Alasan: ${message || ''}`}
            </p>
            <p style="font-size: 10px;">Apabila Anda memiliki pertanyaan lebih lanjut, silakan hubungi kami.</p>
        </div>
    `;
};
exports.generateDeactivateBakeryMailContent = generateDeactivateBakeryMailContent;
const generateRejectBakeryMailContent = (userName, status, message) => {
    return `
        <div style="padding: 10px; font-family: 'Poppins', sans-serif;">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Baumans&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                body, div, h1, h3, p {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            <h1>Status Bakeri</h1>
            <p>Hai, <span style="font-weight: bold;">${userName || ''}</span></p>
            <p style="font-weight: 500;"><span style="font-weight: bold;">${status || ''}</span></p>
            <p style="font-weight: 500; font-size: 14px;">Silakan melakukan registrasi kembali</p>
            <p style="margin-top: 10px; font-weight: 400; font-size: 14px; color: #333;">
                ${`Alasan: ${message || ''}`}
            </p>
            <p style="font-size: 10px;">Apabila Anda memiliki pertanyaan lebih lanjut, silakan hubungi kami.</p>
        </div>
    `;
};
exports.generateRejectBakeryMailContent = generateRejectBakeryMailContent;
const generateNewBakeryMailContent = (bakeryName) => {
    return `
        <div style="padding: 10px; font-family: 'Poppins', sans-serif;">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Baumans&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                body, div, h1, h3, p {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            <h1>Pendaftaran Bakeri Baru</h1>
            <p style="margin-top: 15px; font-weight: 400; font-size: 14px; color: #333;">
                Terdapat pendaftaran bakeri baru dengan nama <span style="font-weight: bold;">${bakeryName || ''}</span>
            </p>
        </div>
    `;
};
exports.generateNewBakeryMailContent = generateNewBakeryMailContent;
