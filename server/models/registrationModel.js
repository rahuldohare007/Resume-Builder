let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let salt = 10;

let registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Length must be greater than 2"],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email must be unique"],
      validate: {
        validator: function (v) {
          const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!pattern.test(v)) {
            throw new Error("Email is invalid");
          }
        },
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const pattern =
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
          if (!(pattern.test(v) && !v.includes(this.name))) {
            throw new Error(
              "Password must have one symbol and not included username"
            );
          }
        },
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not supported",
      },
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          if (!(v.length == 10)) {
            throw new Error("Number must 10 digit");
          }
        },
      },
    },
    slug: {
      type: String,
    },
    token: {
      type: Array,
      require: true,
    },
    secret: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

//Using middleware for salting the password
registrationSchema.pre("save", async function (next) {
  if (this.password) {
    let hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } else {
    throw new Error("all Field is required *");
  }
});

//This is for the compare password by bcrypt
registrationSchema.methods.comparePassword = async function (row, hash) {
  let matchPassword = await bcrypt.compare(row, hash);
  return matchPassword;
};

//This is for the saving refresh token in db
registrationSchema.methods.addToken = async function (refToken) {
  if (this.token.length > 3) {
    throw new Error("Max Limit Cross");
  } else {
    await this.updateOne({ $push: { token: refToken } });
  }
};

//This is for removing refresh token in db
registrationSchema.methods.removeToken = async function (reftoken) {
  await this.updateOne({ $pull: { token: reftoken } });
};

//This is for removing all refresh token in db
registrationSchema.methods.removeAllToken = async function () {
  await this.updateOne({ $set: { token: [] } });
};

//This is for registration model
let registration = mongoose.model("regi", registrationSchema);
module.exports = registration;
