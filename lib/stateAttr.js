const stateAttrb = {
	'event' : {
		name: 'Event',
		type: 'string',
		role: 'value',
	},
	'headline' : {
		name: 'Headline',
		type: 'string',
		role: 'value',
	},
	'color' : {
		name: 'Alarm color',
		type: 'string',
		role: 'value',
	},
	'icon' : {
		name: 'Alarm icon',
		type: 'string',
		role: 'value',
	},
	'level' : {
		name: 'Alarm level',
		type: 'number',
		role: 'value',
	},
	'levelText' : {
		name: 'Alarm level text',
		type: 'string',
		role: 'value',
	},
	'type' : {
		name: 'Alarm type',
		type: 'number',
		role: 'value',
	},
	'typeText' : {
		name: 'Alarm type text',
		type: 'string',
		role: 'value',
	},
	'description' : {
		name: 'Description',
		type: 'string',
		role: 'value',
	},
	'sender' : {
		name: 'Sender of the Alarm',
		type: 'string',
		role: 'value',
	},
	'effective' : {
		name: 'Date Alarm gets effective',
		type: 'string',
		role: 'value.datetime',
	},
	'expires' : {
		name: 'Date Alarm expires',
		type: 'string',
		role: 'value.datetime',
	},
	'link' : {
		name: 'Link',
		type: 'string',
		role: 'value',
	},
	'updateIdentifier' : {
		name: 'Identifier of update',
		type: 'string',
		role: 'value',
	},
	'sent' : {
		name: 'Last Update',
		type: 'string',
		role: 'value.datetime',
	},
};

module.exports = stateAttrb;
