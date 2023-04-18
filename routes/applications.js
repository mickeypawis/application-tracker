const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const Recap = require('../models/recap')
const applcationController = require('../controllers/applications')

router.route('/')
    .get(applcationController.index)
    .post(applcationController.newApplication)

//add new
router.get('/new',(req,res)=>{
    res.render('applications/new') 
})

router.route('/:id')
    .get(applcationController.showIndividual)
    .put(applcationController.updateApplication)
    .delete(applcationController.deleteApplication)


    
//edit applications
router.get('/:id/edit', async (req, res) => {
    const application = await Application.findById(req.params.id)
    res.render('applications/edit', { application });
})



//recap part
router.post('/:id/recaps', async (req, res) => {
    const application = await Application.findById(req.params.id);
    const recap = new Recap(req.body.recap);
    application.recaps.push(recap);
    await recap.save();
    await application.save();
    res.redirect(`/applications/${application._id}`);
})

router.delete('/applications/:id/recaps/:recapId',async (req, res) => {
    const { id, recapId } = req.params;
    await Application.findByIdAndUpdate(id, { $pull: { recaps: recapId } });
    await Recap.findByIdAndDelete(recapId);
    res.redirect(`/applications/${id}`);
})

module.exports = router;