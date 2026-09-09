const mongoose = require("mongoose");
/**
 * job description: string
 * resume text: string
 * self  description: string
 * 
 * matchscore: number
 * 
 * technical questions:
 * [{
 * question: string
 * intent: string
 * answer: string
 * }]
 
 * behavioral questions:[{
 question: string
 * intent: string
 * answer: string
}]
 * skill gaps:[{
 *  skill: string
 *  severity: string
 *  enum: ['low', 'medium', 'high']

}]
 * preparation plan:[{
 * day:number,
*  focus: string,
*  tasks:[string]
}]
 * 
 */

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        requires:[ true, 'technical question is required']
    }, 
    intention:{
        type: String,
        required:[ true , 'intention is required']
    },
    answer:{
        type: String,
        required:[ true, 'answer is required']
    }
},{
    _id:false
})

const behavioralQuestionSchema = new mongoose.Schema({
     question:{
        type: String,
        requires:[ true, 'technical question is required']
    }, 
    intention:{
        type: String,
        required:[ true , 'intention is required']
    },
    answer:{
        type: String,
        required:[ true, 'answer is required']
    }
},{
   _id:false 
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true, 'skill is required']
    },
    severity:{
        type:String,
        enum:['low', 'medium', 'high'],
        required:[true,'severity is required']

    }
},
{
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,'day is required']
    },
    focus:{
        type:String,
        required:[true,'focus is required']
    },
    tasks:[{
        type:String,
        required:[true,'task is required']
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required : [true,'Job description is required']
    },
    resume:{
        type:String,
        required: [true, 'resume is required']
    },
    selfDescription:{
        type:String,
        required: [true, 'self description is required']
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema]
},{
    timestamps:true 
})

const interviewReportModel = mongoose.model('interviewReports', interviewReportSchema);

module.exports = interviewReportModel;
