import mongoose from "mongoose"
const getPrural = (noun) => {
    if (/y$/.test(noun)) return noun.replace(/y$/, "ies")
    return noun + "s"
}
export async function getData({ search = "", page = 0, asc = 1, sort = "name", limit = 10 }, exact = []) {
    const n = {
        Book: ["author", "category", "editorial"],
        Lend: ["book", "student"]
    }
    const a = {
        Book: ["author.name", "category.name", "editorial.name"],
        Lend: ["book.name", "student.name", "status"]
    }
    const regExp = new RegExp(search, "i")
    const object = {}
    for (let property of exact) {
        if (property.name.includes("id")) object[property.name] = mongoose.Types.ObjectId(property.value)
        else object[property.name] = property.value
    }
    const nested = (n[this.modelName] || []).map(n => {
        return [{ $lookup: { from: getPrural(n), localField: n, foreignField: "_id", as: n } }, { $unwind: `$${n}` }]
    }).flat()
    const atrributes = (a[this.modelName] || []).map(attribute => ({ [attribute]: regExp }))
    let $match = { ...object, $or: [{ name: regExp }, ...atrributes] }
    const response = await this.aggregate([
        ...nested,
        {
            $facet: {
                results: [
                    { $match },
                    { $sort: { [sort]: asc } },
                    { $skip: page * limit },
                    { $limit: limit }
                ],
                totalCount: [
                    { $match },
                    { $count: 'totalCount' }
                ]
            }
        }
    ])
    const { results, totalCount } = response[0]
    const count = totalCount[0] ? totalCount[0].totalCount : 0
    return { count, results }
}


async function create(_, props, models) {
    let object = Object.values(props)[0]
    for (let key in object) {
        if (typeof object[key] === "object") {
            if (!object[key]._id) {
                const model = models.find(m => m.modelName.toLowerCase() === key)
                object[key] = await model.create(object[key])
            }
        }
    }
    if (object._id) object = await this.findByIdAndUpdate(object._id, object, { new: true })
    else object = await this.create(object)
    const { count, results } = await getData.bind(this)({}, [{ name: "_id", value: object._id }])
    return results[0]
}
async function del(_, { _id }) {
    await this.findByIdAndDelete(_id)
    return _id
}
async function prural(_, { filter = {}, exact = [] }) {
    return await getData.bind(this)(filter, exact)
}
async function singular(_, { _id }) {
    const { count, results } = await getData.bind(this)({}, [{ name: "_id", value: _id }])
    return results[0]
}

export function assingResolvers(...models) {
    const resolvers = {
        mutations: {},
        querys: {}
    }
    for (let model of models) {
        resolvers.mutations[`create${model.modelName}`] = (_, props) => create.bind(model)(_, props, models)
        resolvers.mutations[`delete${model.modelName}`] = del.bind(model)
        resolvers.querys[`${model.modelName.toLowerCase()}s`] = prural.bind(model)
        resolvers.querys[`${model.modelName.toLowerCase()}`] = singular.bind(model)
    }
    return resolvers
}




