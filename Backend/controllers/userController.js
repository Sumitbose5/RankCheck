const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
    try {

        const { page = 1, limit = 10, search = "" } = req.query;

        // Convert page & limit to numbers
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const skip = (pageNumber - 1) * pageSize;

        // Search filter (case-insensitive, checks name and email)
        const searchQuery = search
            ? {
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { roll_no: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        // Fetch filtered and paginated users
        const users = await User.find(searchQuery).skip(skip).limit(pageSize);

        // Get total count for pagination
        const totalUsers = await User.countDocuments(searchQuery)

        return res.status(200).json({
            success: true,
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
            currentPage: pageNumber,
            message: "Users fetched successfully!"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


exports.deleteUser = async(req, res) => {
    try {
        const { id } = req.params; // Extract user ID from URL params
        const deletedUser = await User.findByIdAndDelete(id);
    
        if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.json({ message: "User deleted successfully", deletedUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}
