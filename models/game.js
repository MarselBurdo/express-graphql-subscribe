import mongoose from 'mongoose'

const {Schema, model}=mongoose

const games= new Schema({
  teams:[{
    type: Schema.Types.ObjectId,
    ref:'teams'
  }],
  pair: Number,
  status:String,
  winFirst: Boolean,
  winSecond: Boolean,
})

export default model('games', games)
