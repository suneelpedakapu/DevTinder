const adminAuth=(req,res,next)=>{
  const token="suneel";
  const adminAuth=token==="suneel";
  if(adminAuth){
    res.send("Admin Authorized")
  }
  else{
    next()
  }
}

const user=(req,res,next)=>{
  const token="pandu";
  const adminAuth=token==="pandu";
  if(adminAuth){
    res.send("User Found")
  }
  else{
    next()
  }
}

module.exports={
  adminAuth,user
}