import {z} from "zod";

import { amount, requiredText, wholeNumber } from "../../lib/validation";

export const  groupFormSchema=z.object({
    name:requiredText(100),
    year:wholeNumber(2020,2100),
    season:z.enum(["Winter", "Spring", "Summer", "Autumn"]),
    price:amount,
    maxStudents:wholeNumber(1,500),
    isActive:z.boolean(),
lessonMode:z.enum(["weekly","manual","keep"])


})
