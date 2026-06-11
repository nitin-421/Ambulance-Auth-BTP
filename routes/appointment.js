const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const {
    driverName,
    vehicleNo,
    hospitalId,
    hospitalName,
    service,
  } = req.body;

  console.log(req.body);

  try {
    const result = await pool.query(
      `
      INSERT INTO ambulance_appointments
      (driver_name, vehicle_no, hospital_id, hospital_name, service)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [driverName, vehicleNo, hospitalId, hospitalName, service]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
      // message: "Error creating appointment",
    });
  }
});

router.get("/user/:vehicleNo", async (req, res) => {
  const { vehicleNo } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM ambulance_appointments
      WHERE vehicle_no = $1
      ORDER BY created_at DESC
      LIMIT 3
      `,
      [vehicleNo]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Error fetching appointments",
    });
  }
});

module.exports = router;