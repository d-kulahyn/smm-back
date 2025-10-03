async;
addToStream(streamName, string, data, (Record), options ?  : {
    maxLen: number,
    id: string
});
Promise < string > {
    const: fieldValuePairs, string, []:  = [],
    for(, [key, value], of, Object) { }, : .entries(data)
};
{
    fieldValuePairs.push(key, String(value));
}
const addOptions = {};
if (options?.maxLen) {
    addOptions.MAXLEN = options.maxLen;
}
const result = await this.client.xAdd(streamName, options?.id || '*', fieldValuePairs, addOptions);
return result;
//# sourceMappingURL=redis.service.js.map