const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        const newUser = await User.create({ email, hashed_password: hashedPassword });
        res.status(201).send({ user: newUser });
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
        return res.status(401).send({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.send({ user, token });
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
