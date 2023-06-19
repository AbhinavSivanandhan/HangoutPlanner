const Occasion = require('../models/occasions');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessTOken: mapBoxToken }) //this contains the forward and backward geocoding methods
const {cloudinary} = require('../cloudinary');


module.exports.index = async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/index',{ occasions });
}

module.exports.renderNewForm = async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/new');
}

module.exports.createOccasion = async (req, res, next) => {
   const geoData = await geocoder.forwardGeocode({
      query: 'req.body.occasion.location',
      limit: 1
   }).send()
   console.log(geoData.body.features[0].geometry.coordinates);
   const occasion = new Occasion(req.body.occasion);
   occasion.images = req.files.map(f => ({ url: f.path, filename: f.filename}))
   occasion.author = req.user._id;
   await occasion.save();
   console.log(occasion);
   req.flash('success', 'Successfully made a new event');
   res.redirect(`/occasions/${occasion._id}`);
}

module.exports.showOccasion  = async (req, res) => {
   const occasion = await Occasion.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
         path: 'author'
      }
   }).populate('author');
   console.log(occasion);
   if(!occasion){
      req.flash('error', 'Cannot find that event!')
      res.redirect('/occasions');
   }
   res.render('occasions/show', { occasion }); //.populate expands the id in reviews to full object
}

module.exports.renderEditForm = async (req, res) => {
   const { id } = req.params;
   const occasion = await Occasion.findById(id);
   if(!occasion){
      req.flash('error', 'Cannot find that event!')
      res.redirect('/occasions');
   }
   res.render('occasions/edit', { occasion });
}

module.exports.updateOccasion = async (req, res) => {
   const { id } = req.params;
   console.log(req.body);
   const occasion = await Occasion.findByIdAndUpdate(id, {...req.body.occasion}); //change this later to just use previously found id to update. reduces cost
   const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
   occasion.images.push(...imgs);
   await occasion.save();
   if (req.body.deleteImages){
      for(let filename of req.body.deleteImages){
         await cloudinary.uploader.destroy(filename);
      }
      await occasion.updateOne({$pull: {images: {filename: {$in : req.body.deleteImages}}}})
      console.log(occasion)
   }
   req.flash('success', 'Successfully updated the event');
   res.redirect(`/occasions/${occasion._id}`)
}

module.exports.deleteOccasion = async (req, res) => {
   const { id } = req.params;
   await Occasion.findByIdAndDelete(id);
   res.redirect('/occasions');
}