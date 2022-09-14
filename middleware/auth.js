import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    try {
        if (!req.headers.authorization) {
            return req;
        } else {
            const token = req.headers.authorization.split(' ')[1];
            const isCustomAuth = token.length < 500;
            let decodedData;
            if (token && isCustomAuth) {
                decodedData = jwt.verify(token, process.env.SECRET_KEY);
                req.userId = decodedData?.id;
            } else {
                decodedData = jwt.decode(token)
                req.userId = decodedData?.sub;
            }
        }
        next();
    } catch(error) {
        console.log(error);
    }
}

export default auth;