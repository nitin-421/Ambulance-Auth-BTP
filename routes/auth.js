const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(`
      SELECT *
      FROM ambulance_users
      WHERE username = $1
      AND password = $2
      `,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      {
        driverName: user.driver_name,
        vehicleNo: user.vehicle_no,
      },
      process.env.JWT_KEY
    );
    
    res.json({
      token,
      user: {
        driverName: user.driver_name,
        vehicleNo: user.vehicle_no,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;