const bodyParser = require('body-parser');
const shortid = require('shortid');
const Url = require('../models/Url');

const shortener = async (req, res) => {
        try {
          const { longUrl, customAlias, topic } = req.body;
          // console.log(req.body.longUrl);
          if (!longUrl) {
            console.log(req.body);
            return res.status(400).json({ error: "longUrl is required"});
          }
      
          let shortUrl = customAlias || shortid.generate();
          
          // Check if custom alias already exists
          if (customAlias) {
            const existingUrl = await Url.findOne({ shortUrl: customAlias });
            if (existingUrl) {
              return res.status(400).json({ error: "Custom alias already taken" });
            }
          }
      
          const newUrl = new Url({ longUrl, shortUrl, topic });
          await newUrl.save();
      
          return res.status(201).json({
            shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
            createdAt: newUrl.createdAt,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Server error" });
        }
}

module.exports = shortener;