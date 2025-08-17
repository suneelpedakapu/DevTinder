const adminAuth=(req,res,next)=>{
  const name="suneel";
  const isAuthorized= name==="suneel";
  if(!isAuthorized){
    res.status(401).send("Unauthorized")
  }
  else{
    next()
  }
};

module.exports={
  adminAuth
}