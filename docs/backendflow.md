# Backend Workflow

## Objects:
**ride[]**
```
{
		rideid,
		riderid,
		driverid,
		pickuplocation[xcoordinate,ycoordinate],  
		dropofflocation[xcoordinate,ycoordinate],
		timestamp[timestamp of desired time],
		isAvalible[boolean]
}
```

**user[]**
```
{
	id,
	email,
	password,
	bchaddr,
	paymentInvoices{
		rideid,
		txdata=""
	}
}
```


## Methods:

**Search(`location[xcoordinate,ycoordinate], range[number_of_miles]`)**
>Returns:
	rides[]{}

**selectRide(`rideid`)**
>Returns:
	return paymentInvoices[] item to the riderid

**RequestRide(``origin[xcoordinate,ycoordinate],
destination[xcoordinate,ycoordinate],
timestamp``)**
>Returns:
	adds an item to the ride[] list
