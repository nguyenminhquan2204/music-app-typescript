interface ObjectSearch {
    keyword: string,
    regex?: RegExp
};

const searchHelper = (query: Record<string, any>): ObjectSearch => {
    let objectSearch: ObjectSearch = {
        keyword: "",
        // regex: ""
    }
    if(query.keyword) {
        objectSearch.keyword = query.keyword;

        // Cú pháp regex
        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }

    return objectSearch;
}

export default searchHelper;