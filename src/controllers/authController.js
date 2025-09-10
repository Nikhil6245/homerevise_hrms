import UserModel from '../models/userModel.js';
import jwtUtils from '../utils/hashHelper.js';

// Register a new user
// authController.js

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role_id,
      is_active,

      // Employee fields
      company_id,
      employee_code,
      first_name,
      last_name,
      middle_name,
      phone,
      mobile,
      date_of_birth,
      gender,
      marital_status,
      nationality,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      department_id,
      position_id,
      manager_id,
      hire_date,
      employment_type,
      employment_status,
      termination_date,
      termination_reason,
      base_salary,
      hourly_rate,
      currency,
      pay_frequency,
      avatar_url,
      bio,
      skills,
      languages,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relationship,
      emergency_contact_address,
      created_by,
      updated_by
    } = req.body;

    if (!username || !email || !password || !company_id || !employee_code || !first_name || !last_name || !hire_date) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const newUser = await UserModel.register(
      { username, email, password, role_id, is_active },
      {
        company_id,
        employee_code,
        first_name,
        last_name,
        middle_name,
        email,
        phone,
        mobile,
        date_of_birth,
        gender,
        marital_status,
        nationality,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        department_id,
        position_id,
        manager_id,
        hire_date,
        employment_type,
        employment_status,
        termination_date,
        termination_reason,
        base_salary,
        hourly_rate,
        currency,
        pay_frequency,
        avatar_url,
        bio,
        skills,
        languages,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
        emergency_contact_address,
        created_by,
        updated_by
      }
    );

    const token = jwtUtils.generateToken({ userId: newUser.id, email: newUser.email });
    const refreshToken = jwtUtils.generateRefreshToken({ userId: newUser.id, email: newUser.email });

    res.status(201).json({
      success: true,
      message: 'User & employee registered successfully',
      user: newUser,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate user
    const authResult = await UserModel.authenticate(email.toLowerCase(), password);
    
    if (!authResult.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT tokens
    const token = jwtUtils.generateToken({
      userId: authResult.user.id,
      email: authResult.user.email
    });

    const refreshToken = jwtUtils.generateRefreshToken({
      userId: authResult.user.id,
      email: authResult.user.email
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: authResult.user,
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Refresh JWT token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwtUtils.verifyToken(token);
    
    // Generate new access token
    const newToken = jwtUtils.generateToken({
      userId: decoded.userId,
      email: decoded.email
    });

    res.status(200).json({
      success: true,
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

// Verify OTP (placeholder)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during OTP verification'
    });
  }
};

// Aliases
export const user = getProfile;
export const Signup = register;