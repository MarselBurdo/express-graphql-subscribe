import mongoose from 'mongoose'

const {Schema, model}=mongoose

const teams= new Schema({
  name: String,
  skill: Number
})

export default model('teams', teams)
