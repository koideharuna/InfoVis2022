class Vec3
{
    constructor( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


class Vec3
{
    add( v )
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
     }    
}


class Vec3
{
    sub( v )
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
     }    
}
    

class Vec3
{
    sum( )
    {
        return this.x + this.y + this.z;    
     }
}
   

class Vec3
{
    min( )
    {
        //return Math.min( this.x, this.y, this.z );
        const m =  this.x < this.y ? this.x : this.y;
        return m < this.z ? m : this.z;
    }  
}


class Vec3
{
    max( )
    {
        //return Math.max( this.x, this.y, this.z );
        const m = this.x > this.y ? this.x : this.y;
        return m > this.z ? this.z : m;
    }  
}


class Vec3
{
    mid( )
    {
        return this.sum() - this.min() - this.max();
    }  
}


class Vec3
{
    cross( v )
    {
        var x = this.x, y = this.y, z = this.z;
        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    }  
}


class Vec3
{
    length( )
    {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    }  
}
