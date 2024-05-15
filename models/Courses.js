const { Schema, model } = require("mongoose");

const CourseSchema = Schema({
  type: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  btntxt: {
    type: String,
    required: true,
  },
  Coursedata: {
    type: Array,
    required: true,
  },
  resume: {
    type: String,
  },
  info: {
    type: Array,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

CourseSchema.method('toJSON', function(){
  const {_id, __v, ...object} = this.toObject()
  object.id = _id
  return object
})

module.exports = model("Course", CourseSchema);
