# Backend Workflow

## Database Objects:
**ride[]**
```
{
		rideid,
		riderid,
		driverid,
		pickuplocation[xcoordinate,ycoordinate],  
		dropofflocation[xcoordinate,ycoordinate],
		timestamp[timestamp of desired time],
		isClaimed[boolean]
		isPaid
}
```

**user[]**
```
{
	id,
	email,
	password,
	bchaddr,
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

**calculateRiderFare(``rideid, currency``)**
>Calculates fare based on drivingDistance + minimum charge.

**createPaymentInvoice(``rideid``)**
>checks for and creates a BCH address in local storage.  Calls calculateRiderFare() and returns BCH amount + address (saved in local storage)

**createPayment(``bchAmount, bchAddress``)**
>creates a bip70 invoice using bitcoin.com's payment api, and reurns the payment link

**listenForPayment(``paymentUrl``)**
>waits for user to open their wallet, send funds, and callsback createAndPayContract() upon recieveing funds.
