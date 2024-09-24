"use server";
import { safeUnstableCache } from "@/utils/safeFetch";

let count = 0;
async function testNullRetUncached() {
  console.log("CACHE MISS: testNullRetUncached");
  count++;
  if (count % 5 == 0) {
    return "v";
  } else {
    throw Error("ERROR: HERE");
  }
}

export const testNullRet = safeUnstableCache(testNullRetUncached, ["test-null-ret"], { revalidate: 10 });
