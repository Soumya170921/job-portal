const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

router.post('/register', async (req,res)=>{
  const { name, email, password, role, company } = req.body;
  if(!name || !email || !password) return res.status(400).json({msg:'Missing fields'});
  try{
    const [exists] = await pool.query('SELECT id FROM users WHERE email=?',[email]);
    if(exists.length) return res.status(400).json({msg:'Email already registered'});
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users(name,email,password,role,company) VALUES(?,?,?,?,?)',
      [name,email,hashed,role || 'jobseeker', company || null]);
    const userId = result.insertId;
    const token = jwt.sign({ id:userId, role: role || 'jobseeker' }, JWT_SECRET, { expiresIn:'7d' });
    res.json({ token, user: { id:userId, name, email, role }});
  }catch(err){ console.error(err); res.status(500).json({msg:'Server error'}); }
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({msg:'Missing fields'});
  try{
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?',[email]);
    if(!rows.length) return res.status(400).json({msg:'Invalid credentials'});
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({msg:'Invalid credentials'});
    const token = jwt.sign({ id:user.id, role:user.role }, JWT_SECRET, { expiresIn:'7d' });
    res.json({ token, user: { id:user.id, name:user.name, email:user.email, role:user.role }});
  }catch(err){ console.error(err); res.status(500).json({msg:'Server error'}); }
});

module.exports = router;