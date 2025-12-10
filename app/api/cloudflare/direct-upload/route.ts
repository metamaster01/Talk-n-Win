// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { meta } = await req.json();

//     const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
//     const token = process.env.CLOUDFLARE_API_TOKEN!;

//     const res = await fetch(
//       `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           maxDurationSeconds: meta?.maxDurationSeconds ?? undefined,
//           meta: meta ?? {},
//           requireSignedURLs: false,
//         }),
//       }
//     );

//     const json = await res.json();
//     if (!json.success) {
//       return NextResponse.json(
//         { error: json.errors?.[0]?.message ?? "Cloudflare error" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({
//       uploadURL: json.result.uploadURL,
//       uid: json.result.uid, // this becomes cloudflare_video_id
//     });
//   } catch (e: any) {
//     return NextResponse.json(
//       { error: e.message ?? "Unknown error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawMeta = body?.meta ?? {};
    const maxDurationSeconds = body?.maxDurationSeconds;

    // Cloudflare expects meta values to be strings.
    const meta: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawMeta)) {
      if (v === undefined || v === null) continue;
      meta[k] = String(v);
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const token = process.env.CLOUDFLARE_API_TOKEN!;

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // only include if present
          ...(maxDurationSeconds ? { maxDurationSeconds } : {}),
          meta,
          requireSignedURLs: false,
        }),
      }
    );

    const json = await res.json();

    if (!json.success) {
      // log full error for debugging
      console.error("Cloudflare direct_upload error:", json.errors, json.messages);

      return NextResponse.json(
        {
          error:
            json.errors?.[0]?.message ??
            json.messages?.[0]?.message ??
            "Cloudflare error",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      uploadURL: json.result.uploadURL,
      uid: json.result.uid,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
