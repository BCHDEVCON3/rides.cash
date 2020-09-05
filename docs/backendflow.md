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

**searchRides(`location[xcoordinate,ycoordinate], range[number_of_miles]`)**
>Returns:
	rides[]{}

**selectRide(`rideid`)**
>Returns:
	return paymentInvoices[] item to the riderid

**requestRide(``origin[xcoordinate,ycoordinate],
destination[xcoordinate,ycoordinate],
timestamp``)**
>Returns:
	adds an item to the ride[] list

**getDrivingDistance(``origin[xcoordinate,ycoordinate],
destination[xcoordinate,ycoordinate]``)**
>Returns drivingDistance in miles

**calculateRiderFare(``rideid``, currency)**
>Calculates fare based on drivingDistance + minimum charge.

**createPaymentInvoice(``rideid``)**
>checks for and creates a BCH address in local storage.  Calls calculateRiderFare() and returns BCH amount + address (saved in local storage)
