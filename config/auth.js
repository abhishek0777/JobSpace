// ensure authentication for authenticated users or guest users
module.exports={
    ensureAuthenticated:(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }

        req.flash('error_msg','Please login to view that resource')
        res.redirect('/');
    },
    forwardAuthenticated:(req,res,next)=>{
        if(!req.isAuthenticated())
        {
            return next();
        }
        
    }
}

//this module require to save routes