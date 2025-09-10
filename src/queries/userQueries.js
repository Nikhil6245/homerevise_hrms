const userQueries = {
  // Insert new user
   insertUser: `
    INSERT INTO users (
      username, email, password_hash, role_id, is_active
    ) VALUES (?, ?, ?, ?, ?)
  `,

  insertEmployee: `
    INSERT INTO employees (
      company_id, user_id, employee_code, first_name, last_name, middle_name, email,
      phone, mobile, date_of_birth, gender, marital_status, nationality, address_line1, address_line2,
      city, state, postal_code, country, department_id, position_id, manager_id, hire_date,
      employment_type, employment_status, termination_date, termination_reason, base_salary,
      hourly_rate, currency, pay_frequency, avatar_url, bio, skills, languages,
      emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, emergency_contact_address,
      created_by, updated_by
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `,
  // Find user by email
  findByEmail: `
    SELECT * FROM users WHERE email = ?
  `,

  // Find user by ID
  findById: `
    SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?
  `,

  // Find user by ID with password
  findByIdWithPassword: `
    SELECT * FROM users WHERE id = ?
  `,

  // Update user name
  updateUser: `
    UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `,

  // Update user password
  updatePassword: `
    UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `,

  // Delete user
  deleteUser: `
    DELETE FROM users WHERE id = ?
  `,

  // Get all users
  getAllUsers: `
    SELECT id, email, name, created_at, updated_at FROM users ORDER BY created_at DESC
  `,

  // Check if email exists
  checkEmailExists: `
    SELECT COUNT(*) as count FROM users WHERE email = ?
  `
};

export default userQueries;