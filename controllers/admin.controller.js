// import { client } from "../RedisCache/client.js";
import { userModel } from "../models/user.model.js";
import { userActivationMail } from "../utils/activateUserNotificationProducer.js";
import { userDeactivationMail } from "../utils/deactivateUserNotificatioProducer.js";



export const activateUser = async (req, res) => {

    try {

        console.log("activating user...............")
        const { userEmail } = req.body;

        const existingUser = await userModel.findOne({ email: userEmail });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        existingUser.activeStatus = true;



        await existingUser.save();



        res.status(200).json({ message: "User is marked active" });

        await userActivationMail(existingUser);

        console.log("User activated successfully...............");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }

}


export const deactivateUser = async (req, res) => {

    try {

        console.log("deactivating user...............")
        const { userEmail } = req.body;

        const existingUser = await userModel.findOne({ email: userEmail });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        existingUser.activeStatus = false;



        await existingUser.save();


        res.status(200).json({ message: "User is marked inactive" });

        await userDeactivationMail(existingUser);

        console.log("User deactivated successfully...............");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" });
    }

}


export const allUser = async (req, res) => {


    try {
        const allUser = await userModel.find({});

        console.log("sending data to the admin...............");

        res.status(200).json({ message: allUser });
    } catch (error) {


        res.status(500).json({ message: "Internal Server error" });

    }


}


