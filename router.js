// router.js
const express = require("express");
const upload = require('./routers/multer');

const User = require("./models/User");
const Achievement = require("./models/Achievement");
const Post = require("./models/Post");


const router = express.Router();

const staticFiles = "C:\\Users\\DELL\\Desktop\\Webdash\\public";
const path = require("path");

// --- Routes ---

router.get("/", (req, res) => {
    // res.sendFile(path.join(staticFiles, "home.html"));
    res.render("home.ejs");
});

router.get("/edit-profile", (req, res) => {
    res.render("editProfile.ejs");
});

router.get('/profile/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).lean();
        if (!user) return res.status(404).send("User not found");

        const userAchievements = await Achievement.find({ user_id: id }).lean();
        res.render('viewProfile.ejs', { user, achievements: userAchievements });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get("/feed", async (req, res) => {
    try {
        const posts = await Post.find().populate("user_id").lean();
        res.render("community-feed.ejs", { posts_users: posts.reverse() });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get('/directory', async (req, res) => {
    try {
        const users = await User.find().lean();
        res.render("alumniCards.ejs", { users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get("/achievements", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");
        const achievements = await Achievement.find({ user_id: req.session.user.user_id }).lean();
        res.render("achievements.ejs", { achievements: achievements.reverse() });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get("/dashboard", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login"); // ensure only logged-in users access
    }

    const user = await User.findById(req.session.user.user_id).lean();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    res.render("dashboard", { user, posts });
});



router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
});

router.get("/login", (req, res) => res.render("login.ejs"));
router.get("/signup", (req, res) => res.render("signup.ejs"));

router.post("/add-achievements", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");
        const data = req.body;
        await Achievement.create({
            user_id: req.session.user.user_id,
            name: data.name,
            org: data.org,
            description: data.description,
            month: data.month,
            year: data.year
        });
        res.redirect("/achievements");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post('/upload-pfp', isLoggedIn, upload.single('pfp'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');

        const user = await User.findById(req.session.user.user_id);
        if (!user) return res.status(404).send("User not found");

        user.pfp = req.file.filename; // Save uploaded filename
        await user.save();

        res.redirect('/edit-profile'); // stays logged in
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.post('/post', upload.none(), async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");
        await Post.create({
            user_id: req.session.user.user_id,
            post: req.body.content,
            tags: req.body.tags.split(",").map(t => t.trim())
        });
        res.redirect('/feed');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).lean();
        if (user && user.password === req.body.password) {
            req.session.user = { name: user.name, user_id: user._id.toString() };
            return res.redirect("/dashboard"); // no query string needed
        }
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}


router.post("/signup", async (req, res) => {
    try {
        const existing = await User.findOne({ email: req.body.email }).lean();
        if (existing) return res.redirect("/login");

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name || ""
        });

        req.session.user = { name: user.name || "", user_id: user._id.toString() };
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
