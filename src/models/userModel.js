import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import userQueries from '../queries/userQueries.js';

const UserModel = {


  async register(userData, employeeData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Insert into users
    const [userResult] = await connection.execute(userQueries.insertUser, [
      userData.username,
      userData.email.toLowerCase(),
      hashedPassword,
      userData.role_id || null,
      userData.is_active || 1
    ]);

    const userId = userResult.insertId;  // ✅ this is the FK for employees.user_id

    // Insert into employees
    await connection.execute(userQueries.insertEmployee, [
      employeeData.company_id,
      userId,   // ✅ foreign key reference
      employeeData.employee_code,
      employeeData.first_name,
      employeeData.last_name,
      employeeData.middle_name || null,
      employeeData.email || null,
      employeeData.phone || null,
      employeeData.mobile || null,
      employeeData.date_of_birth || null,
      employeeData.gender || 'Prefer not to say',
      employeeData.marital_status || 'Single',
      employeeData.nationality || null,
      employeeData.address_line1 || null,
      employeeData.address_line2 || null,
      employeeData.city || null,
      employeeData.state || null,
      employeeData.postal_code || null,
      employeeData.country || null,
      employeeData.department_id || null,
      employeeData.position_id || null,
      employeeData.manager_id || null,
      employeeData.hire_date,
      employeeData.employment_type || 'full-time',
      employeeData.employment_status || 'active',
      employeeData.termination_date || null,
      employeeData.termination_reason || null,
      employeeData.base_salary || null,
      employeeData.hourly_rate || null,
      employeeData.currency || 'USD',
      employeeData.pay_frequency || 'monthly',
      employeeData.avatar_url || null,
      employeeData.bio || null,
      employeeData.skills || null,
      employeeData.languages || null,
      employeeData.emergency_contact_name || null,
      employeeData.emergency_contact_phone || null,
      employeeData.emergency_contact_relationship || null,
      employeeData.emergency_contact_address || null,
      employeeData.created_by || null,
      employeeData.updated_by || null
    ]);

    await connection.commit();

    return {
      success: true,
      id: userId,
      username: userData.username,
      email: userData.email
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


,
  // Find user by email
  async findByEmail(email) {
    try {
      const [rows] = await pool.execute(userQueries.findByEmail, [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  async findById(id) {
    try {
      const [rows] = await pool.execute(userQueries.findById, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  },

  // Update user
  async updateUser(id, userData) {
    const { name } = userData;
    
    try {
      const [result] = await pool.execute(userQueries.updateUser, [name, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  async delete(id) {
    try {
      const [result] = await pool.execute(userQueries.deleteUser, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Get all users
  async findAll() {
    try {
      const [rows] = await pool.execute(userQueries.getAllUsers);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Check if email exists
  async emailExists(email) {
    try {
      const [rows] = await pool.execute(userQueries.checkEmailExists, [email]);
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  },

  // Authenticate user
  async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const isPasswordValid = await this.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid password' };
      }

      const { password: userPassword, ...userWithoutPassword } = user;
      return { 
        success: true, 
        user: userWithoutPassword 
      };
    } catch (error) {
      throw error;
    }
  }
};

export default UserModel;