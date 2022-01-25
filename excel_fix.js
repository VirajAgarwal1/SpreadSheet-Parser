module.exports = function (test) {
    new_json = []
    for (let index = 0; index < test.length; index++) {
        const element = test[index];
        temp_elm = {}
        i = 0
        currentKey = '---'
        for (const [key, value] of Object.entries(element)) {
            if (key != '__EMPTY'){
                temp_elm[key] = [value]
                currentKey = key
            }else{
                temp_elm[currentKey].push(value)
            }
            i = i + 1
        }
        new_json.push(temp_elm)
    }
    return new_json
}