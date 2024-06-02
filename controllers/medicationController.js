const db = require("../models");
const logger = require("../utils/pino");

//add medication
exports.addMedications = async (req, res, next) => {
    try {

        console.log(req.body);

        const nullValues = Object.keys(req.body).filter((e) => { return !req.body[e] });

        if (nullValues.length > 0) return res.json(`Please fill this values : ${nullValues.join(",")}`);

        console.log(req.body.time);

        const reminder = await db.sequelize.models.medication.create({
            ...req.body,
            user_id: req.user.id
        });

        return res.json({
            success: true,
            msg: JSON.parse(JSON.stringify(reminder, null, 2))
        });

    } catch (error) {
        logger.error(error);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//update medications
exports.updateMedications = async (req, res, next) => {
    try {

        const user = await db.sequelize.models.medication.findOne({
            where: {
                user_id: req.user.id,
                id: req.params.med_id
            }
        })

        if (!user) return res.json("unable to update medication");

        Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        })

        await user.save();

        return res.json({
            success: true,
            msg: JSON.parse(JSON.stringify(user, null, 2))
        })

    } catch (error) {
        logger.error(error);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//delete medication
exports.deleteMedications = async (req, res, next) => {
    try {

        const medicine = await db.sequelize.models.medication.findOne({
            where: {
                user_id: req.user.id,
                id: req.params.med_id
            }
        });

        const deleteMedicine = await medicine.destroy();

        return res.json({
            success: true,
            msg: "Medicine deleted successfully"
        })

    } catch (error) {
        logger.error(error);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//get medicines
exports.getMedications = async (req, res, next) => {
    try {

        const medications = await db.sequelize.models.medication.findAll();

        return res.json({
            success: true,
            msg: JSON.parse(JSON.stringify(medications, null, 2))
        })

    } catch (error) {
        logger.error(error);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//get single medications
exports.getMedication = async (req, res, next) => {
    try {

        const medications = await db.sequelize.models.medication.findAll({
            where: {
                user_id: req.user.id,
                id: req.params.med_id
            }
        });

        return res.json({
            success: true,
            msg: JSON.parse(JSON.stringify(medications, null, 2))
        })

    } catch (error) {
        logger.error(error);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//mark as done
exports.markDone = async (req, res, next) => {
    try {

        const findStatus = await db.sequelize.models.medication_status.findOne({
            where: {
                user_id: req.query.user_id,
                date: req.query.date,
                time: req.query.time
            }
        })

        if (findStatus) {
            findStatus.status = req.query.status
            await findStatus.save()
        } else {
            const markDone = await db.sequelize.models.medication_status.create(req.query);
        }

        return res.json({
            success: true,
            msg: "Status updated successfully"
        })


    } catch (error) {
        logger.error(error);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}