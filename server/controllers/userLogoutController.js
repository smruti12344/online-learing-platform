const userLogout = async (_,res)=>{
    try {
        return res.status(200).cookie("jwtToken","",{maxAge:0}).json({
            success:true,
            message:"log out successfully"
        })
        
    } catch (error) {
        console.log("error in logout",error);
        return res.status(500).json({
            success:false,
            message:"Faild to logout"
        })
    }
}
export default userLogout;