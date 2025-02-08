const getImgFromFolder = async (req, res) => {
    try {
       const { folderName } = req.body;
       console.log("folderName-->", folderName);
 
       if (!folderName) {
          return res.status(400).json({
             success: false,
             message: "Folder name is required"
          });
       }
 
       // config cloudinary with secure
       cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
       });
       //  First, list all root folders to verify existence
       const folders = await new Promise((resolve, reject) => {
          cloudinary.api.root_folders((error, result) => {
             if (error) reject(error);
             else resolve(result);
          });
       });
 
       console.log("Available folders:", folders);
 
       const result = await new Promise((resolve, reject) => {
          cloudinary.api.resources(
             {
                type: "upload",
                prefix: folderName.trim(), // folder name
                // prefix: 'e_com_banner' // folder name
                // prefix: folderName.trim() // folder name
                // max_results: maxResults,
                // direction: order === "desc" ? -1 : 1,
                // // additional options for more details
                // resource_type: "image",
                // metadata: true
             },
             (error, result) => {
                if (error) reject(error);
                else resolve(result);
             }
          );
       });
 
       if (!result.resources || result.resources.length === 0) {
          return res.status(404).json({
             success: false,
             message: `No images found in folder: ${folderName}`,
             data: {
                folderName,
                result
             }
          });
       }
 
       res.status(200).json({
          success: true,
          message: "Images fetched successfully",
          data: {
             resources: result.resources,
             total: result.resources.length,
             folderName: folderName
          }
       });
    } catch (err) {
       console.log("Cloudinary Error:", err);
       res.status(500).json({
          success: false,
          message: "Error fetching images from Cloudinary",
          error: err.message
       });
    }
 };