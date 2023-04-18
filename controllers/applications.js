const Application = require('../models/application')

//get
module.exports.index =  async (req,res)=>{
    const applications = await Application.find();
    res.render('applications/index',{applications})
}

//post
module.exports.newApplication =  async(req,res)=>{
    // console.log(req.body.application)
    const application = new Application(req.body.application);
    await application.save();
    res.redirect("/applications")
}

//show individual
module.exports.showIndividual =  async (req, res,) => {
    const application = await Application.findById(req.params.id).populate('recaps')
    console.log(application)
    res.render('applications/show', { application });
};
module.exports.updateApplication = async (req, res) => {
    const { id } = req.params;
    const applcation = await Application.findByIdAndUpdate(id, { ...req.body.application });
    res.redirect(`/applications`)
};
//delete 
module.exports.deleteApplication = async(req,res)=>{
    const { id } = req.params;
    await Application.findByIdAndDelete(id);
    res.redirect('/applications');
}

