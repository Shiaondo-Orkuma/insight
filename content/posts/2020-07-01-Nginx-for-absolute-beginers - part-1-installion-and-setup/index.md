---
title: Nginx for absolute beginers - part 1 installion and setup
author: Shiaondo Orkuma Alex
date: 2020-07-01
hero: ./images/nginx.png
excerpt: This guide is the first of a four-part series. Parts One and Two will walk you through installing NGINX Open Source from the NGINX repositories and making some configuration changes to increase performance and security. Parts Three and Four set up NGINX to serve your site over HTTPS and harden the TLS connection.
---

## Before You Begin

- You will need root access to the system, or a user account with **sudo** privilege
- Set your system’s hostname.
- Update your system

## Install NGINX

### Stable Versus Mainline

The first decision to make about your installation is whether you want the Stable or Mainline version of NGINX Open Source. Stable is recommended, and will be what this series of guides uses. More on NGINX versions [here](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/#stable_vs_mainline)

## Binary Versus Compiling from Source

There are three primary ways to install NGINX Open Source:
**\*A pre-built binary from your Linux distribution’s repositories.** This is the easiest installation method because you use your package manager to install the **nginx** package. However, for distributions which provide binaries (as opposed to build scripts), you’ll be running an older version of NGINX than the current stable or mainline release. Patches can also be slower to land in distro repositories from upstream

**\* A pre-built binary from NGINX Inc.’s repository.** This is the installation method used in this series. It’s still an easy installation process which only requires that you add the repository to your system and then install as normal. This method has the benefit of the most vanilla, upstream configuration by default, with quicker updates and newer releases than a Linux distribution’s repository. Compile-time options often differ from those of the NGINX binary in distribution repositories, and you can use **nginx -V** to see which your binary was built with.

**\*Compiling from source.** This is the most complicated method of installation but still not impractical when following [NGINX’s documentation.](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/) Source code is updated frequently with patches and maintained at the newest stable or mainline releases, and building can be easily automated. This is the most customizable installation method because you can include or omit any compiling options and flags you choose. For example, one common reason people compile their own NGINX build is so they can use the server with a newer version of OpenSSL than what their Linux distribution provides.

### Installation Instructions

The [NGINX admin](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#installing-a-prebuilt-package) guide gives clear and accurate instructions for any installation method and NGINX version you choose, so we won’t mirror them here. When your installation completes, return here to continue the series.

## Configuration NotesPermalink

As use of the NGINX web server has grown, NGINX, Inc. has worked to distance NGINX from configurations and terminology that were used in the past when trying to ease adoption for people already accustomed to Apache.

If you’re familiar with Apache, you’ll know that multiple site configurations (called Virtual Hosts in Apache terminology) are stored at `/etc/apache/sites-available/`, which symlink to files in`/etc/apache/sites-enabled/`. However, many guides and blog posts for NGINX recommend this same configuration. As you could expect, this has led to some confusion, and the assumption that NGINX regularly uses the `../sites-available/` and `../sites-enabled/` directories, and the `www-data` user. It does not.

Sure, it can. The NGINX packages in Debian and Ubuntu repositories have changed their configurations to this for quite a while now, so serving sites whose configuration files are stored in `/sites-available/`and symlinked to `/sites-enabled/` is certainly a working setup. However it is unnecessary, and the Debian Linux family is the only one which does it. Do not force Apache configurations onto NGINX.

Instead, multiple site configuration files should be stored in `/etc/nginx/conf.d/` as `example.com.conf`, or `example.com.disabled`. Do not add server blocks directly to `/etc/nginx/nginx.conf` either, even if your configuration is relatively simple. This file is for configuring the server process, not individual websites.

The NGINX process also runs as the username ngnix in the nginx group, so keep that in mind when adjusting permissions for website directories. For more information, see [Creating NGNIX Plus Configuration Files](https://www.nginx.com/resources/admin-guide/configuration-files/).

## NGINX Configuration Best Practices

There is a large variety of customizations you can do to NGINX to fit it better to your needs. Many of those will be exclusive to your use case though; what works great for one person may not work at all for another

This series will provide configurations that are general enough to be useful in just about any production scenario, but which you can build on for your own specialized setup. Everything in the section below is considered a best practice and none are reliant on each other. They’re not essential to the function of your site or server, but they can have unintended and undesirable consequences if disregarded.

Two quick points:

    * Before going further, first preserve the default nginx.conf file so you have something to restore to if your customizations get so convoluted that NGINX breaks.
    ```
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup-original
    ```
    * After implementing a change below, reload your configuration with:
    ```
    nginx -s reload
    ```

### Use Multiple Worker Processes

Add or edit the following line in `/etc/nginx/nginx.conf`, in the area just before the `http` block. This is called the `main` block, or context, though it’s not marked in `nginx.conf` like the `http` block is. The first choice would be to set it to `auto`, or the amount of CPU cores available to your Linode.

```
worker_processes auto;
```

### Disable Server Tokens

NGINX’s version number is visible by default with any connection made to the server, whether by a successful 201 connection by cURL, or a 404 returned to a browser. Disabling server tokens makes it more difficult to determine NGINX’s version, and therefore more difficult for an attacker to execute version-specific attacks.

Server tokens enabled:

<div className="Image__Small">
  <img
    src="./images/nginxst.jpg"
    title="Server tokens enabled"
    alt="Alt text"
  />
</div>

Server tokens disabled:

<div className="Image__Small">
  <img
    src="./images/nginxstd.jpg"
    title="Server tokens disabled"
    alt="Alt text"
  />
</div>

Add the following line to the `http` block of `/etc/nginx/nginx.conf:`

```
server_tokens off;
```

### Set Your Site’s Root Directory

The directory NGINX serves sites from differs depending on how you installed it. At the time of this writing, NGINX supplied from NGINX Inc.’s repository uses `/usr/share/nginx/`.

The NGINX docs warn that relying on the default location can result in the loss of site data when upgrading NGINX. You should use `/var/www/`, `/srv/`, or some other location that won’t be touched by package or system updates. For more explanation, see [Using the default document root](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#using-the-default-document-root) and [Not using standard document root locations](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#not-using-standard-document-root-locations).
