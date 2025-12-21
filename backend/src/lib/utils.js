//src/lib/utils.js
import jwt from 'jsonwebtoken';
export const generateToken = (userId, res) => {
const token = jwt.sign({ id: userId }, process.env.JWT_SECRET ||
'my_secret_key', { expiresIn: '7d' });
res.cookie('JWT', token, {
httpOnly: true,
maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
sameSite: 'strict',
secure: process.env.NODE_ENV !== 'development'
});
return token;
};
// end of src/lib/utils.js
