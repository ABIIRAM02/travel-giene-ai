import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  const users = await prisma.user.findMany({
    include : {
      trips : true
    }
  });

  const trips = await prisma.trip.findMany({
    where : {
      budget : {
        gte : 8000
      }
    }
  })

  let count = 2;

  // if (count === 20) {
  //  const id = await prisma.user.findUnique({
  //   where : {
  //     email : 'abiram@gmail.com'
  //   },
  //   select : {
  //     id : true
  //   }
  //  })

  //  console.log({id})

  //  await prisma.user.update({
  //    where : {
  //     id : id?.id
  //    },
  //    data : {
  //     plan: 'PREMIUM'
  //    }
  //  });

  //   count++;
  // };

  return (
    <div>
      <pre>{JSON.stringify(trips, null, 2)}</pre>
    </div>
  );
}
