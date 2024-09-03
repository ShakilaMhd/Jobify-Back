import { Company } from "../models/company.model.js"

//register company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "companyName is required",
                success: false
            })
        }
        let company = await Company.findOne({ name: companyName })
        if (company) {
            return res.status(400).json({
                message: "you cant register same company",
                success: false
            })
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        })
        return res.status(201).json({
            message: "company regitered successfully",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//get company
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; //logged in user Id
        const companies = await Company.find({ userId })
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//get company by Id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId)
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//update company
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file
        //iadhar cloudinary
        const updateData = { name, description, website, location }
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true })
        if (!company) {
            return res.status(404).json({
                message: "company not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "company information updated",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}