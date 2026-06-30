const songModel=require("../models/songs.model")
const id3=require("node-id3")
const storageService=require("../services/storage.service")

async function songUpload(req,res){
    const songBuffer=req.file.buffer
    const {mood}=req.body

    const tags= id3.read(songBuffer)
    
    const [songFile,posterFile]=await Promise.all([
        storageService.uploadFile({
        buffer:songBuffer,
        filename:tags.title,
        folder:"/cohort-2/moodify/songs"
    }),
    storageService.uploadFile({
        buffer:tags.image.imageBuffer,
        filename:tags.title + ".jpg",
        folder:"/cohort-2/moodify/posters"
    })
    ])


    const song=await songModel.create({
        title:tags.title,
        url:songFile.url,
        posterUrl:posterFile.url,
        mood
    })

    res.status(201).json({
        message:"Song created successfully",
        song
    })
}


async function getSongs(req,res){
 const {mood}=req.query

 const song= await songModel.findOne({
    mood
 })

 res.status(200).json({
    song
 })
}
module.exports={songUpload,getSongs}