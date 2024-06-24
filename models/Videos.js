const { Schema, model } = require("mongoose");

const VideosSchema = Schema({
  type: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

VideosSchema.method('toJSON', function(){
  const {_id, __v, ...object} = this.toObject()
  object.id = _id
  return object
})

module.exports = model("Video", VideosSchema);
