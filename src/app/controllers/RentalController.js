class RentalController {
    index(req,res,next){
        res.render('rental')
    }
}

module.exports = new RentalController()