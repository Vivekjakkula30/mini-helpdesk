import bcrypt from "bcrypt";
import db from "./src/config/db.js";

const resetAdminPassword = async () => {
    const email = "neha@gmail.com";
    const newPassword = "Neha@123";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
        `UPDATE users
         SET password = ?
         WHERE email = ?`,
        [hashedPassword, email]
    );

    console.log("Updated rows:", result.affectedRows);

    if (result.affectedRows === 0) {
        console.log("No user found with this email.");
    } else {
        console.log("Password reset successfully.");
    }

    await db.end();
};

resetAdminPassword().catch((error) => {
    console.error("Password reset failed:", error);
});